import { DataSource } from 'typeorm';

export interface ISeederRunner {
  run(dataSource: DataSource): Promise<void>;
}
export interface ISeederData {
  [roleName: string]: string[];
}
