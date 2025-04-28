import { Exclude } from 'class-transformer';
import { Post } from 'src/post/entities/post.entity';
import { Session } from 'src/session/entities/session.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column()
  role: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
