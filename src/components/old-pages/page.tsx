"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, ImageIcon, FileText, Loader2 } from "lucide-react"
import { image, textOnly, MetadataLicenseType, MetadataAttributeType, MediaImageMimeType } from "@lens-protocol/metadata";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/navigation"
import { storageClient } from "@/lib/storage-client";
// import { acl } from '@/lib/acl';
import { post } from "@lens-protocol/client/actions";
import { useLensAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"


interface AttachmentProps {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export default function CreatePage() {
  const [content, setContent] = useState("")
  const [isOriginal, setIsOriginal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<AttachmentProps[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [licenseType, setLicenseType] = useState<'creative-commons' | 'token-bound-nft' | null>(null)
  const [ccLicense, setCcLicense] = useState("CC BY-NC")
  const [tbnlCommercial, setTbnlCommercial] = useState<'C' | 'NC'>('NC')
  const [tbnlDerivatives, setTbnlDerivatives] = useState<'D' | 'DT' | 'DTSA' | 'ND'>('D')
  const [tbnlPublicLicense, setTbnlPublicLicense] = useState<'PL' | 'NPL'>('NPL')
  const [tbnlAuthority, setTbnlAuthority] = useState<'Ledger' | 'Legal'>('Legal')
  const router = useRouter()
  const { sessionClient } = useLensAuthStore();


  const handleFileSelect = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList = event.target.files!
    if (Array.from(fileList).some(i => i.size > 8 * 1024 * 1024)) {
      // 8MB limit
      toast.error("File size must be less than 8MB");
      return;
    }

    try {
      // Upload image to Grove storage
      let attachments = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const url = await uploadFile(file)
        let res = {
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        }
        attachments.push(res)
      }
      setSelectedFile(attachments)
    } catch (uploadError) {
      toast.error("Failed to upload image. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (isOriginal && !licenseType) {
      toast.error("Please select a license for your Original Content")
      return
    }

    setIsSubmitting(true)

    try {
      let metadata;
      let client = sessionClient;

      if (!client || !client.isSessionClient()) {
        throw new Error("Failed to get public client");
      }
  
      //license Metadata
      let licenseValue: string
      if (isOriginal) {
        if (licenseType === 'creative-commons') {
          licenseValue = ccLicense
        } else if (licenseType === 'token-bound-nft') {
          licenseValue = `TBNL_${tbnlCommercial}_${tbnlDerivatives}_${tbnlPublicLicense}_${tbnlAuthority}`
        }
      }

      //Get attributes
      const attributes = getPostAttributes();
      function getPostAttributes(): any[] {
        const attributes: any[] = [
          {
            key: "originalDate",
            type: MetadataAttributeType.DATE,
            value: new Date().toISOString(),
          }
        ];
        
        if (licenseValue) {
          attributes.push({
            key: "license",
            type: MetadataAttributeType.STRING,
            value: licenseValue,
          });
        }
        return attributes;
      }

      //Create Metadata
      if (!selectedFile) {
        metadata = textOnly({
          content,          
          attributes,
        })
      } 
      else {
        metadata = image({
          content,
          image: {
            item: selectedFile[0].url!,
            type: selectedFile[0].type as MediaImageMimeType,
          },
          attachments: selectedFile.map(i => ({
            item: i.url!,
            type: i.type as MediaImageMimeType,
          })),
          attributes,
        })
      }

      // Upload metadata to storage and create post via Lens Protocol SDK
      const { uri } = await storageClient.uploadAsJson(metadata);
      await post(client, { contentUri: uri });

      toast.success("Your post has been created successfully!")

      router.push("/");
    } catch (error) {
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Create New Post</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Input */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind? Share your thoughts, ideas, or stories..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-right text-sm text-gray-500">{content.length}/500</div>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label>Media (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {selectedFile ? (
                        selectedFile.map(file => (
                          <div className="flex space-x-2 items-center" key={file.name}>
                            <ImageIcon className="h-8 w-8 text-green-600" />
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload an image</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Original Content Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="original-toggle" className="text-sm font-medium">
                      Mark as Original Content
                    </Label>
                    <p className="text-xs text-gray-600">Enables you to specific a license.</p>
                  </div>
                  <Switch 
                  id="original-toggle" 
                  checked={isOriginal} 
                  onCheckedChange={(checked) => {
                      setIsOriginal(checked);
                      if (!checked) {
                        setLicenseType(null);
                      }
                    }}
                  className="data-[state=checked]:bg-yellow-300"
                  />
                </div>

                {/* License Selection - Only show when marked as original */}
                {isOriginal && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <Label className="text-sm font-medium">Choose a License</Label>
                    
                    {/* License Type Selection */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                      {/* Token Bound NFT License */}
                      <div className="space-y-2">
                        <label className="block cursor-pointer group">
                          <input
                            type="radio"
                            name="licenseType"
                            value="token-bound-nft"
                            checked={licenseType === 'token-bound-nft'}
                            onChange={() => setLicenseType('token-bound-nft')}
                            className="sr-only"
                          />
                          <div className={`
                            relative py-2 px-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                            ${
                              licenseType === 'token-bound-nft'
                                ? 'border-yellow-500 bg-yellow-50 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}>
                            <div className="flex items-start space-x-3">
                              <div className={`
                                w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors
                                ${
                                  licenseType === 'token-bound-nft'
                                    ? 'border-yellow-300 bg-yellow-300'
                                    : 'border-gray-300 group-hover:border-gray-400'
                                }
                              `}>
                                {licenseType === 'token-bound-nft' && (
                                  <div className="w-full h-full rounded-full bg-white scale-[0.4]"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-sm mb-1">
                                  Token Bound NFT License
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Blockchain-based licensing
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Creative Commons License */}
                      <div className="space-y-2">
                        <label className="block cursor-pointer group">
                          <input
                            type="radio"
                            name="licenseType"
                            value="creative-commons"
                            checked={licenseType === 'creative-commons'}
                            onChange={() => setLicenseType('creative-commons')}
                            className="sr-only"
                          />
                          <div className={`
                            relative py-2 px-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                            ${
                              licenseType === 'creative-commons'
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}>
                            <div className="flex items-start space-x-3">
                              <div className={`
                                w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors
                                ${
                                  licenseType === 'creative-commons'
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300 group-hover:border-gray-400'
                                }
                              `}>
                                {licenseType === 'creative-commons' && (
                                  <div className="w-full h-full rounded-full bg-white scale-[0.4]"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-sm mb-1">
                                  Creative Commons License
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Standard Creative Commons licensing
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Token Bound NFT License Options */}
                    {licenseType === 'token-bound-nft' && (
                      <div className="space-y-6 pl-3">
                        {/* Commercial Usage */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Commercial Usage</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-commercial"
                                value="NC"
                                checked={tbnlCommercial === 'NC'}
                                onChange={(e) => setTbnlCommercial(e.target.value as 'C' | 'NC')}
                              />
                              <span className="text-sm">Non-Commercial (default)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-commercial"
                                value="C"
                                checked={tbnlCommercial === 'C'}
                                onChange={(e) => setTbnlCommercial(e.target.value as 'C' | 'NC')}
                                //className="appearance-none w-3 h-3 rounded-full border border-gray-400 checked:bg-black checked:border-black"
                              />
                              <span className="text-sm">Commercial</span>
                            </label>
                          </div>
                          {tbnlCommercial === 'C' ? (
                            <div className="bg-orange-50 p-2 rounded border border-orange-200">
                              <p className="text-xs text-orange-700">
                                <strong>Commercial (C):</strong> This license allows the NFT owner to make money from the work, including selling merchandise, licensing for commercial use, and other revenue-generating activities.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <p className="text-xs text-green-700">
                                <strong>Non-Commercial (NC):</strong> This license does not permit commercial use. The work can be used for personal, educational, or non-profit purposes only.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Derivatives */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Derivatives</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-derivatives"
                                value="D"
                                checked={tbnlDerivatives === 'D'}
                                onChange={(e) => setTbnlDerivatives(e.target.value as 'D' | 'DT' | 'DTSA' | 'ND')}
                              />
                              <span className="text-sm">Derivatives (default)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-derivatives"
                                value="DT"
                                checked={tbnlDerivatives === 'DT'}
                                onChange={(e) => setTbnlDerivatives(e.target.value as 'D' | 'DT' | 'DTSA' | 'ND')}
                              />
                              <span className="text-sm">Derivatives-NFT</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-derivatives"
                                value="DTSA"
                                checked={tbnlDerivatives === 'DTSA'}
                                onChange={(e) => setTbnlDerivatives(e.target.value as 'D' | 'DT' | 'DTSA' | 'ND')}
                              />
                              <span className="text-sm">Derivatives-NFT-Share-Alike</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-derivatives"
                                value="ND"
                                checked={tbnlDerivatives === 'ND'}
                                onChange={(e) => setTbnlDerivatives(e.target.value as 'D' | 'DT' | 'DTSA' | 'ND')}
                              />
                              <span className="text-sm">No-Derivatives</span>
                            </label>
                          </div>
                          {tbnlDerivatives === 'D' && (
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">
                              <p className="text-xs text-blue-700">
                                <strong>Derivatives (D):</strong> Allows unrestricted creation of derivative works. Others can modify, adapt, and build upon the work in any format or medium.
                              </p>
                            </div>
                          )}
                          {tbnlDerivatives === 'DT' && (
                            <div className="bg-purple-50 p-2 rounded border border-purple-200">
                              <p className="text-xs text-purple-700">
                                <strong>Derivatives-NFT (DT):</strong> Derivative works are allowed but must be minted as NFTs. This ensures blockchain-based tracking of derivative creations.
                              </p>
                            </div>
                          )}
                          {tbnlDerivatives === 'DTSA' && (
                            <div className="bg-indigo-50 p-2 rounded border border-indigo-200">
                              <p className="text-xs text-indigo-700">
                                <strong>Derivatives-NFT-Share-Alike (DTSA):</strong> Derivative works must be NFTs and carry the same license terms. This ensures consistent licensing across all derivative works.
                              </p>
                            </div>
                          )}
                          {tbnlDerivatives === 'ND' && (
                            <div className="bg-red-50 p-2 rounded border border-red-200">
                              <p className="text-xs text-red-700">
                                <strong>No-Derivatives (ND):</strong> Derivative works are not allowed. The work can be used as-is but cannot be modified, adapted, or built upon.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Public License */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Public Rights</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-public-license"
                                value="PL"
                                checked={tbnlPublicLicense === 'PL'}
                                onChange={(e) => setTbnlPublicLicense(e.target.value as 'PL' | 'NPL')}
                              />
                              <span className="text-sm">Public-License</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-public-license"
                                value="NPL"
                                checked={tbnlPublicLicense === 'NPL'}
                                onChange={(e) => setTbnlPublicLicense(e.target.value as 'PL' | 'NPL')}
                              />
                              <span className="text-sm">No-Public-License (default)</span>
                            </label>
                          </div>
                          {tbnlPublicLicense === 'PL' ? (
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <p className="text-xs text-green-700">
                                <strong>Public-License (PL):</strong> Grants broad rights to the public to reproduce the work. Anyone can use and distribute the work under the specified terms.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-amber-50 p-2 rounded border border-amber-200">
                              <p className="text-xs text-amber-700">
                                <strong>No-Public-License (NPL):</strong> Restricts rights to the licensee only. The general public does not have automatic rights to reproduce or distribute the work.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Authority */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Authority</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-authority"
                                value="Ledger"
                                checked={tbnlAuthority === 'Ledger'}
                                onChange={(e) => setTbnlAuthority(e.target.value as 'Ledger' | 'Legal')}
                              />
                              <span className="text-sm">Ledger-Authoritative</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tbnl-authority"
                                value="Legal"
                                checked={tbnlAuthority === 'Legal'}
                                onChange={(e) => setTbnlAuthority(e.target.value as 'Ledger' | 'Legal')}
                              />
                              <span className="text-sm">Legal-Authoritative (default)</span>
                            </label>
                          </div>
                          {tbnlAuthority === 'Ledger' ? (
                            <div className="bg-indigo-50 p-2 rounded border border-indigo-200">
                              <p className="text-xs text-indigo-700">
                                <strong>Ledger-Authoritative (Ledger):</strong> The blockchain ledger serves as the final authority for all licensing decisions. Smart contracts automatically enforce terms without possibility of legal override.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-purple-50 p-2 rounded border border-purple-200">
                              <p className="text-xs text-purple-700">
                                <strong>Legal-Authoritative (Legal):</strong> Traditional legal systems retain authority over licensing disputes. Courts and legal institutions can override blockchain-based decisions when necessary.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Creative Commons License Options */}
                    {licenseType === 'creative-commons' && (
                      <div className="space-y-6 pl-6">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cc-by"
                            name="cc-license"
                            value="CC BY"
                            checked={ccLicense === "CC BY"}
                            onChange={(e) => setCcLicense(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="cc-by" className="text-sm font-medium cursor-pointer">
                              CC BY
                            <p className="text-xs text-gray-600 mt-1">
                              CC BY (Attribution) allows both commercial use and the creation of derivative works, but requires
                              attribution to the original creator.
                            </p>
                            </Label>
                            
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cc-by-nc"
                            name="cc-license"
                            value="CC BY-NC"
                            checked={ccLicense === "CC BY-NC"}
                            onChange={(e) => setCcLicense(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="cc-by-nc" className="text-sm font-medium cursor-pointer">
                              CC BY-NC (default)
                            <p className="text-xs text-gray-600 mt-1">
                              CC BY-NC (Attribution-NonCommercial) does not permit commercial use but allows for the creation of derivative works.
                              Attribution to the original creator is required.
                            </p>
                            </Label>
                            
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cc-by-nd"
                            name="cc-license"
                            value="CC BY-ND"
                            checked={ccLicense === "CC BY-ND"}
                            onChange={(e) => setCcLicense(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="cc-by-nd" className="text-sm font-medium cursor-pointer">
                              CC BY-ND
                            <p className="text-xs text-gray-600 mt-1">
                              CC BY-ND (Attribution-NoDerivs) permits commercial use but does not allow the creation of derivative works.
                              Attribution to the original creator is required.
                            </p>
                            </Label>
                            
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cc0"
                            name="cc-license"
                            value="CC0"
                            checked={ccLicense === "CC0"}
                            onChange={(e) => setCcLicense(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="cc0" className="text-sm font-medium cursor-pointer">
                              CC0
                            <p className="text-xs text-gray-600 mt-1">
                              CC0 (Public Domain Dedication) permits both commercial use and the creation of derivative works, without the
                              need for attribution.
                            </p>
                            </Label>
                            
                          </div>
                        </div>

                        
                      </div>
                    )}


                  </div>
                )}

               
                <div className="flex justify-end space-x-4">
                   {/* Clear Button */}
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setContent("")
                      setSelectedFile(null)
                      setIsOriginal(false)
                      setLicenseType(null)
                    }}
                  >
                    Clear
                  </Button>

                  {/* Publish Button */}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Post"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
