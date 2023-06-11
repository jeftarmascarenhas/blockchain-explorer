import { ethers } from "ethers";
import styles from "./page.module.css";
import Link from "next/link";

const providerUrl = `https://eth-mainnet.g.alchemy.com/v2/SAxzRau7bQi55UAZ-6EwYXh86FPEwhKE`;
const baseUrl = `https://etherscan.io/`;
// const providerUrl = `https://polygon-mumbai.g.alchemy.com/v2/RI8JMKbVFeCJ-XxtNwCB-A1Eh2e70385`
// const baseUrl = `https://mumbai.polygonscan.com/`

async function getData(limit: number) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const blockNumber = await provider.getBlockNumber();
  const getBlocks = Array.from({ length: limit }, (_, y) =>
    provider.getBlock(blockNumber - (y + 1))
  );
  const blocks = await Promise.all(getBlocks);

  const transactionList = blocks[0]?.transactions.slice(0, limit) as string[];
  const getTransactions = transactionList.map((tx) =>
    provider.getTransaction(tx)
  );

  const transactions = await Promise.all(getTransactions);

  return { blocks, transactions };
}

const formatDate = (date: number) =>
  new Date(date * 1000).toLocaleDateString("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const shortenWallet = (address = "") => `${address?.slice(0, 18)}...`;

const roundNumber = (value: ethers.BigNumberish) =>
  parseFloat(ethers.formatEther(value)).toFixed(4);

export default async function Home() {
  const limit = 10;
  // const { blocks, transactions } = await getData(limit);
  const blocks = [
    {
      hash: "0xff9216bb167fb7a5657e9c02ce88f3ef8dab304fe18bc378e87e0ea13bdc003c",
      number: 17453024,
      timestamp: 1686439811,
      miner: "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5",
      length: 119,
    },
  ];
  const transactions = [
    {
      hash: "0x933de60e0e95ff99a08302b4b3464892d57da419e253758e025ce82b12acb1c7",
      from: "0x22F6CC8738308a8c92a6a71ea67832463d1Fec0d",
      to: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      value: BigInt("994901480631357861"),
    },
  ];
  return (
    <main className={styles.main}>
      <h1 className={styles.logo}>Blockchain Explore</h1>
      <div className={styles.grid}>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Last Blocks ({blocks.length})</h3>
          <ul>
            {blocks?.map((block) => (
              <li key={block?.hash}>
                <div>
                  <Link
                    href={`${baseUrl}/block/${block?.number}`}
                    target="_blank"
                  >
                    {block?.number.toString()}
                  </Link>
                  <br />
                  {formatDate(block?.timestamp as number)}
                </div>
                <div>
                  Validater by:{" "}
                  <Link
                    href={`${baseUrl}/address/${block?.miner}`}
                    target="_blank"
                  >
                    {shortenWallet(block?.miner)}
                  </Link>
                  <br />
                  <Link
                    href={`${baseUrl}/txs?block=${block?.number}`}
                    target="_blank"
                  >
                    {block?.length} txns
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>
            Last Transactions ({transactions.length})
          </h3>
          <ul>
            {transactions?.map((tx) => (
              <li key={tx?.hash}>
                <Link href={`${baseUrl}/tx/${tx?.hash}`} target="_blank">
                  {shortenWallet(tx?.hash)}
                </Link>
                <div>
                  From:{" "}
                  <Link href={`${baseUrl}/address/${tx?.from}`} target="_blank">
                    {shortenWallet(tx?.from)}
                  </Link>
                  <br />
                  To:{" "}
                  <Link href={`${baseUrl}/address/${tx?.to}`} target="_blank">
                    {shortenWallet(tx?.to as string)}
                  </Link>
                </div>
                <div>{roundNumber(tx?.value)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h4 className={styles.footerTitle}>Development by Jeftar Mascarenhas</h4>
    </main>
  );
}
