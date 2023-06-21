import { Answer } from "./answer";
import { Lang } from "./lang";

export interface PtsdQuestion {
    id: number;
    title: Lang;
    description: Lang;
    image_b: string;
    image_g: string;
    answers: Answer[];
}