import { graphql } from "@lens-protocol/client";

export const MediaImageFragment = graphql(
  `
    fragment MediaImage on MediaImage {
      __typename

      full: item

      large: item(request: { preferTransform: { widthBased: { width: 2048 } } })

      thumbnail: item(
        request: { preferTransform: { fixedSize: { height: 128, width: 128 } } }
      )

      altTag
      license
      type
    }
  `
);