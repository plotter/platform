export class PakDirectory {

  public static fromJSON(json: PakDirectoryJSON): PakDirectory {
    let pakDirectory = new PakDirectory();
    // assign properties...
    return pakDirectory;
  }

  public toJSON(): PakDirectoryJSON {
    return JSON.stringify(this);
  }
}

// A representation of User's data that can be converted to
// and from JSON without being altered.
interface PakDirectoryJSON {
}
