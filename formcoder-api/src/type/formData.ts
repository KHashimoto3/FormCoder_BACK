export type CodingFormData = {
  id: number;
  partType: string;
  explanation: string;
  childrenPart: string | CodingFormData[];
  inputIdx: number;
};
