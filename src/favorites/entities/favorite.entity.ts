interface IFavorite {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export class Favorite implements IFavorite {
  artists: string[] = [];
  albums: string[] = [];
  tracks: string[] = [];
}
