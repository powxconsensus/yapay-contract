import * as fse from "fs-extra";

export class DeploymentStore {
  storePath: string = `deployment/deployments.json`;

  constructor(storePath?: string) {
    if (storePath) this.storePath = storePath;
    (async () => {
      try {
        const fileExists = await fse.pathExists(this.storePath);
        if (!fileExists) {
          await fse.ensureDir("deployment");
          await fse.writeJSON(this.storePath, {}, { spaces: 2 });
        }
      } catch (error) {
        console.error("Error creating file:", error);
      }
    })();
  }

  async store(
    pkey: string, //primary key
    kname: string, //secondary key
    value: Object,
  ): Promise<void> {
    let deploymentData = await this.getStore();
    if (pkey && !deploymentData[pkey]) deploymentData[pkey] = {};
    if (kname && !deploymentData[pkey][kname]) deploymentData[pkey][kname] = [];
    deploymentData[pkey][kname].push(value);
    await fse.writeJSON(this.storePath, deploymentData);
  }

  async getStore(): Promise<Object> {
    return await fse.readJSON(this.storePath);
  }
}
