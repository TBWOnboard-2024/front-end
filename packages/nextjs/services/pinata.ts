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

  generateMetadata(tokenId: string, propertyData: any, imageUrls: string[], propertyToken?: string) {
    const baseMetadata = {
      name: `Real Estate NFT #${tokenId}`,
      description: propertyData.description || "This NFT represents ownership of a real-world property.",
      image: imageUrls[0], // Use first image as main image
      attributes: [
        { trait_type: "Area (sqm)", value: propertyData.usableSurface },
        { trait_type: "Number of Rooms", value: propertyData.rooms },
        { trait_type: "Number of Bathrooms", value: propertyData.bathrooms },
        { trait_type: "Address of Property", value: propertyData.location },
        { trait_type: "Property Type", value: propertyData.propertyType === 0 ? "Apartment" : "House" },
        { trait_type: "Construction Year", value: propertyData.constructionYear },
        { trait_type: "Ownership Type", value: propertyData.isShared ? "Fractional" : "Whole" },
      ],
      properties: {
        images: imageUrls,
        title: propertyData.title,
        price: propertyData.price,
        rooms: propertyData.rooms,
        bathrooms: propertyData.bathrooms,
        location: propertyData.location,
        comfort: propertyData.comfort,
        floor: propertyData.floor,
        compartmentalization: propertyData.compartmentalization,
        usableSurface: propertyData.usableSurface,
        constructionYear: propertyData.constructionYear,
        isShared: propertyData.isShared,
      },
    };

    // Add fractional-specific metadata if it's a shared property
    if (propertyData.isShared) {
      baseMetadata.attributes.push(
        { trait_type: "Total Shares", value: 1000 },
        { trait_type: "Price Per Share", value: propertyData.price / 1000 },
        { trait_type: "Property Token", value: propertyToken || "" },
      );

      baseMetadata.properties = {
        ...baseMetadata.properties,
        totalShares: 1000,
        pricePerShare: propertyData.price / 1000,
        propertyToken: propertyToken || "",
      };
    }

    return baseMetadata;
  }
}

// Export singleton instance
export const pinataService = new PinataService();
