import {
  ArticleMetadataFragment,
  AudioMetadataFragment,
  TextOnlyMetadataFragment,
  ImageMetadataFragment,
  VideoMetadataFragment,
  graphql,
} from "@lens-protocol/client";

export const PostMetadataFragment = graphql(
  `
    fragment PostMetadata on PostMetadata {
      __typename
      ... on ArticleMetadata {
        ...ArticleMetadata
      }
      ... on AudioMetadata {
        ...AudioMetadata
      }
      ... on TextOnlyMetadata {
        ...TextOnlyMetadata
      }
      ... on ImageMetadata {
        ...ImageMetadata
      }
      ... on VideoMetadata {
        ...VideoMetadata
      }
    }
  `,
  [
    ArticleMetadataFragment,
    AudioMetadataFragment,
    TextOnlyMetadataFragment,
    ImageMetadataFragment,
    VideoMetadataFragment,
  ]
);