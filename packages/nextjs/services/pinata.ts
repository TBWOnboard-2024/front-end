import { PinataSDK } from "pinata-web3";

const PINATA_GATEWAY = "chocolate-tough-manatee-914.mypinata.cloud";

export class PinataService {
  private pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINIATA_JWT,
      pinataGateway: PINATA_GATEWAY,
    });
  }

  async uploadMetadata(tokenId: string, metadata: any): Promise<string> {
    try {
      const metadataFile = new File([JSON.stringify(metadata)], `metadata_${tokenId}.json`, {
        type: "application/json",
      });

      const upload = await this.pinata.upload.file(metadataFile);
      return `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw error;
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const uploadPromises = images.map(image => this.pinata.upload.file(image));
      const uploads = await Promise.all(uploadPromises);
      return uploads.map(upload => `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading images to Pinata:", error);
      throw error;
    }
  }

  generateMetadata(tokenId: string, propertyData: any, imageUrls: string[]) {
    return {
      name: `Real Estate NFT #${tokenId}`,
      description: "This NFT represents ownership of a real-world property.",
      image: imageUrls[0], // Use first image as main image
      attributes: [
        { trait_type: "Area (sqm)", value: propertyData.usableSurface },
        { trait_type: "Number of Rooms", value: propertyData.rooms },
        { trait_type: "Number of Bathrooms", value: propertyData.bathrooms },
        { trait_type: "Address of Property", value: propertyData.location },
      ],
      properties: {
        images: imageUrls,
        ...propertyData,
      },
    };
  }
}

// Export singleton instance
export const pinataService = new PinataService();
