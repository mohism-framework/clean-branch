import { ActionBase, ArgvOption, IWithSubCommands } from '@mohism/sloty';
import { Dict } from '@mohism/utils';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

class PruneBranchAction extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return `prune you git`;
  }

  async run(options: IWithSubCommands): Promise<void> {
    const d = resolve(options.subCommands[1] || '.');
    this.info(`目录：${d}`)
    if (!existsSync(`${d}/.git`)) {
      this.fatal('不是一个git仓库');
    }
    const branchs = readdirSync(`${d}/.git/refs/heads`);
    const toDelete = await this.question.checkbox('选择要清理的本地分支', branchs);
    if (!await this.question.confirm(`确认删除分支: ${toDelete.join(', ')}`)) {
      this.done('放弃操作');
    }
    process.chdir(d);
    toDelete.forEach(branch => {
      this.exec(`git branch -D ${branch}`, { silent: false });
    });
    this.done('Done!');
  }
}

export default new PruneBranchAction();