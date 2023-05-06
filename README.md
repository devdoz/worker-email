# 邮件处理

CloudFlare 邮箱转发（`Catch-all`）过滤规则服务。

- https://jihulab.com/devdo/worker-email
- https://github.com/devdoz/worker-email

## 特征

- 支持多邮箱白名单
- 支持多邮箱黑名单
- 支持指定域名黑名单

## 布署教程

1.  注册 [CloudFlare 账号](https://www.cloudflare.com/)，并且设置 **Workers** 域名 (比如：`xxx.workers.dev`)

2.  安装 [Wrangler 命令行工具](https://developers.cloudflare.com/workers/wrangler/)。
    ```bash
     npm install -g wrangler
    ```
3.  登录 `Wrangler`（可能需要扶梯）：

    ```bash
    # 登录，可能登录不成功
    wrangler login

    # 若登录不成功，可能需要使用代理。
    # 每个命令行前，均需要加 HTTP_PROXY=http://localhost:20171
    HTTP_PROXY=http://localhost:20171 wrangler login
    ```

4.  拉取本项目,并进入该项目目录：

    ```bash
    git clone https://github.com/devdoz/worker-email.git
    cd worker-email
    ```

5.  修改 `wrangler.toml` 文件中的 `name`（proj）为服务名 `xxx`（访问域名为：`proj.xxx.workers.dev`）

6.  创建 **Workers** 和 **KV**，并绑定 `KV` 到 `Workers`

    1.  **创建 KV，并设置 email 对象值**

        创建名为 `email` 的 `namespace`

        ```bash
           wrangler kv:namespace create email
        ```

        得到

        ```bash
        		⛅️ wrangler 2.19.0
        		--------------------
        		🌀 Creating namespace with title "email-email"
        		✨ Success!
        		Add the following to your configuration file in your kv_namespaces array:
        		{ binding = "email", id = "2870141d9f274c6db12d170e01e0b953" }
        ```

        将上述命令得到的 `kv_namespaces` 保存到 `wrangler.toml` 中，即

        ```bash
           # 替换当前项目该文件内相关的数据，即只需要将 id 的值替换为上一步骤得到的值
           kv_namespaces = [
           { binding = "email", id = "2870141d9f274c6db12d170e01e0b953" }
           ]
        ```

    2.  设置邮箱相关值

        - 1. 设置接收邮箱
             **注意：** 此邮箱必须已经在 CloudFlare 通过验证。

          ```bash
          # json 格式
          wrangler kv:key put --binding=email 'forward' 'dest@email.com'
          ```

        - 2. 白名单列表
             若设置，则忽略**黑名单**。建议不设置。

          ```bash
          # json 格式
          wrangler kv:key put --binding=email 'allow' '["ex1@email.com"]'
          ```

        - 3. 黑名单列表
             若已设置**白名单**，则该列表将失效。

          ```bash
          wrangler kv:key put --binding=email 'block' '["ex1@email.com","ex2@email.com"]'
          ```

        - 4. 黑名单域名列表
             若已设置**白名单**，则该列表将失效。

          ```bash
          wrangler kv:key put --binding=email 'block_domains' '["abc.com","block.com"]'
          ```

7.  发布

    ```bash
     HTTP_PROXY=http://localhost:20171 wrangler publish
    ```

    发布成功将会显示对应的网址

    ```bash
    Proxy environment variables detected. We'll use your proxy for fetch requests.
    ⛅️ wrangler 2.19.0
    --------------------
    Your worker has access to the following bindings:
    - KV Namespaces:
    	- email: 2870141d9f274c6db12d170e01e0b953
    Total Upload: 0.90 KiB / gzip: 0.37 KiB
    Uploaded email (0.87 sec)
    Published email (3.85 sec)
    	https://email.xxx.workers.dev
    Current Deployment ID: 85d498d5-57c7-4970-8844-e5057a3d29f7
    ```

8.  在`指定的域名` -> `Email` -> `Email Routing` -> `Routes` -> `Catch-all address` -> `Edit` -> `Action` (`Send to A Worker`), `Destination` (`email`，该 Worker 服务)

9.  设置目标邮箱（按第 8 步，在 `Routes` 中），`Destination addresses` -> `Add destination address` 添加收件箱地址。

## Template: worker-typescript

- https://github.com/cloudflare/workers-sdk/tree/main/templates

```bash
# full repository clone
$ git clone --depth 1 https://github.com/cloudflare/workers-sdk

# copy the "worker-typescript" example to "my-project" directory
$ cp -rf workers-sdk/templates/worker-typescript my-project

# setup & begin development
$ cd my-project && npm install && npm run dev
```

```bash
HTTP_PROXY=http://localhost:20171 wrangler publish
```
