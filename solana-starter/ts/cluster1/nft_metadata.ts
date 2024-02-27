import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");
const uploader = irysUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(irysUploader());

(async () => {
  try {
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://arweave.net/EADMonGyHixFbNNHqGS1exh7mgilpaYRl_1YsaDRPfM";
    const metadata = {
      name: "Nice Rug Brah",
      symbol: "RUG",
      description: "You just got rugged. To get unrugged, rug someone else.",
      image: image,
      attributes: [{ trait_type: "Rug", value: "Beautiful" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
