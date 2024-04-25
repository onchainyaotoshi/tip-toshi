import db from '../utils/db';

interface TipEntry {
  fromFid: number;
  toFid: number;
  username:string;
  hash: string;
  tx: string;
}

class TipModel {
  /**
   * Checks if a tip entry with the given fid and hash already exists.
   * @param fid The fid to check.
   * @param hash The hash to check.
   * @returns Boolean indicating whether the entry exists.
   */
  static async exists(fromFid: number, hash: string): Promise<boolean> {
    const result = await db('tip')
      .select('id')
      .where({ fromFid, hash })
      .first();
    return !!result;
  }

  /**
   * Inserts a new tip entry into the database.
   * @param entry The TipEntry data to insert.
   * @returns The ID of the inserted entry.
   */
  static async insert(entry: TipEntry): Promise<number> {
    await db('tip').insert(entry);
    return 1;
    // const [id] = await db('tip').insert(entry).returning('id');
    // return id;
  }

  /**
   * Retrieves the last 5 transactions.
   * @returns An array of TipEntry objects containing transaction data.
   */
  static async getLast5Transactions(fid:number): Promise<TipEntry[]> {
    const transactions = await db('tip')
      .select('*')
      .where({ fromFid: fid }) 
      .orderBy('id', 'desc')
      .limit(5);
    return transactions;
  }

}

export default TipModel;