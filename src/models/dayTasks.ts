export interface DayTasks {
  date: Date;
  tasks: {
    id: string;
    description: string;
    textLabels: string[];
    colorLabels: string[];
  }[];
}
