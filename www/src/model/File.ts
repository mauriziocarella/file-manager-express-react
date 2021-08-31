export interface IFileVideoMetadata {
	duration: number,
}
export interface IFileAudioMetadata {
	duration: number,
}
export interface IFileOtherMetadata {}

export interface IFile {
	id: string,
	label: string,
	filename: string,
	size: number,
	tags: string[],
	mimeType: string,
	fileType: string,
	thumbnail?: string,
	createdAt: Date,
	metadata: IFileVideoMetadata | IFileAudioMetadata | IFileOtherMetadata
}
