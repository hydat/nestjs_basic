import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745638630197 implements MigrationInterface {
    name = 'Init1745638630197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`userId\` varchar(255) NOT NULL`);
    }

}
