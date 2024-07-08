import { Address, toNano } from '@ton/ton';
import { Sale } from '../wrappers/Sale';
import { compile, NetworkProvider } from '@ton/blueprint';
import { keyPairFromSecretKey, keyPairFromSeed } from '@ton/crypto';
import { randomBytes } from 'crypto';

console.log(Buffer.from(process.env.ADMIN_SECRET_KEY!, 'hex').length)
const keyPair = keyPairFromSeed(Buffer.from(process.env.ADMIN_SECRET_KEY!, 'hex'));

export async function run(provider: NetworkProvider) {
    const tonPresale = provider.open(
        Sale.createFromConfig(
            {
                adminPubkey: keyPair.publicKey,
                available: 20n,
                price: toNano('2'),
                lastIndex: 39n,
                collection: Address.parse('EQCmbXiftFsF9kNWUUTyP9-2fNYYTanBUOvw2Y8VePK82csW'),
                buyerLimit: 5n,
                startTime: 1719006259n,
                endTime: 1719583200n,
                adminAddress: Address.parse('0QDpZhrFqhlyQT3YCcfF9OnfPfj2oDNKiWqVy4V5MdP0EmD1'),
                helperCode: await compile('Helper')
            },
            await compile('Sale')
        )
    );

    await tonPresale.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tonPresale.address);
}
