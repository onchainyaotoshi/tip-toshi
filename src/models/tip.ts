import db from '../utils/db';

interface TipEntry {
  id?: number; // Adding optional id for updates
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
    const [id] = await db('tip').insert(entry).returning('id');
    return id.id;  // Correct for PostgreSQL
  }

  /**
   * Updates the transaction value for a given entry by ID.
   * @param id The ID of the entry to update.
   * @param tx The new transaction value.
   * @returns Number of affected rows.
   */
  static async updateTxById(id: number, tx: string){
    await db('tip')
      .where({ id })
      .update({ tx });
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