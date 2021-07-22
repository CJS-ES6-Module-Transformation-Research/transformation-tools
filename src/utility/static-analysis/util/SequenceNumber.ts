import { SeqNumb } from "../../types";


export class SequenceNumber implements SeqNumb{
	constructor(start=1) {
		this.seq_no = start
	}
	seq_no: number;

	next(): string {
		return `${this.seq_no++}`;
	}

}