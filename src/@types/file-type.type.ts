type FilePath = string;
type FileId = ({id: string | number} | {url: string}) | {dest: string; path: string}
export type FileFile = FilePath | FileId;
