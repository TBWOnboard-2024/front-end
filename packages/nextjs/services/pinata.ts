import { PinataSDK as PinataFiles } from "pinata";
import { PinataSDK } from "pinata-web3";

const PINATA_GATEWAY = "chocolate-tough-manatee-914.mypinata.cloud";

export class PinataService {
  private pinata: PinataSDK;
  private pinataFiles: PinataFiles;
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINIATA_JWT,
      pinataGateway: PINATA_GATEWAY,
    });

    this.pinataFiles = new PinataFiles({
      pinataJwt: process.env.NEXT_PUBLIC_PINIATA_JWT,
      pinataGateway: PINATA_GATEWAY,
    });
  }

  async uploadMetadata(tokenId: string, metadata: any): Promise<string> {
    try {
      console.log("Starting metadata upload for tokenId:", tokenId);
      console.log("Metadata to upload:", metadata);

      const metadataFile = new File([JSON.stringify(metadata)], `metadata_${tokenId}.json`, {
        type: "application/json",
      });
      console.log("Created metadata file:", metadataFile.name);

      const upload = await this.pinata.upload.file(metadataFile);
      console.log("Upload successful. IPFS Hash:", upload.IpfsHash);

      const finalUrl = `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;
      console.log("Final metadata URL:", finalUrl);

      return finalUrl;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      throw error;
    }
  }

  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const uploadPromises = images.map(image => {
        // Generate random name for the image
        const randomName = crypto.randomUUID();
        const extension = image.name.split(".").pop();
        const newFile = new File([image], `${randomName}.${extension}`, { type: image.type });
        return this.pinataFiles.upload.file(newFile);
      });
      const uploads = await Promise.all(uploadPromises);
      return uploads.map(upload => `https://${PINATA_GATEWAY}/files/${upload.cid}`);
    } catch (error) {
      console.error("Error uploading images to Pinata:", error);
      throw error;
    }
  }

  generateMetadata(tokenId: string, propertyData: any, imageUrls: string[], seller?: string, propertyToken?: string) {
    console.log("Starting metadata generation with:", {
      tokenId,
      propertyData,
      imageUrls,
      propertyToken,
      seller,
    });

    try {
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
          { trait_type: "Ownership Type", value: propertyData.isShared ? "Fractional" : "Whole" },
          { trait_type: "Can Bid", value: propertyData.canBid },
          { trait_type: "Seller", value: seller },
        ],
        properties: {
          images: imageUrls,
          title: propertyData.title,
          price: propertyData.price,
          rooms: propertyData.rooms,
          bathrooms: propertyData.bathrooms,
          location: propertyData.location,
          usableSurface: propertyData.usableSurface,
          isShared: propertyData.isShared,
          canBid: propertyData.canBid,
          seller: seller,
        },
      };

      console.log("Base metadata created:", baseMetadata);

      // Add fractional-specific metadata if it's a shared property
      if (propertyData.isShared) {
        console.log("Adding fractional ownership details. PropertyToken:", propertyToken);

        baseMetadata.attributes.push(
          { trait_type: "Total Shares", value: 1000 },
          { trait_type: "Price Per Share", value: propertyData.price / 1000 },
          { trait_type: "Property Token", value: propertyToken || "" },
        );

        baseMetadata.properties = {
          ...baseMetadata.properties,
        };

        console.log("Fractional metadata added:", baseMetadata);
      }

      console.log("Final metadata:", baseMetadata);
      return baseMetadata;
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const pinataService = new PinataService();
