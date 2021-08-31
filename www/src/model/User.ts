import { IFile } from './File';

export interface IUser {
	id: string,
	email: string,
	favorites: IFile['id'][]
	createdAt: Date,
}
