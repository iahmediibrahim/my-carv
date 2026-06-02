import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('User inserted', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed', this.id);
  }
}
