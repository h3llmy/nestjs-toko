import { DataSource } from 'typeorm';

export interface SeederRunner {
  run(dataSource: DataSource): Promise<void>;
}
