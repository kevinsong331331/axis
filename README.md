# AXIS Perps

纯 JavaScript、HTML、CSS 的 Hyperliquid 永续合约终端。静态服务器根目录为 dist。

## 功能
- BTC、ETH、SOL、HYPE，主网及测试网。
- 标记价格固定盘面中央；右侧等距价格刻度平滑移动，价格统一显示两位小数。
- 浏览器 EIP-1193 钱包连接；每笔交易由钱包签名，私钥不离开钱包。
- Hyperliquid activeAssetCtx WebSocket，10 秒 REST 快照补偿；账户每 5 秒查询。
- 全仓杠杆；IOC 市价开多、开空；reduceOnly 全量平仓；0.5% 滑点上限。
- 从真实持仓绘制开仓均价虚线，按标记价显示未实现盈亏（未扣手续费、资金费用）。
- X intent 分享，用户自行确认发布，不包含钱包地址。

## 运行
`python -m http.server 8080 --directory dist`

打开 http://localhost:8080，浏览器需安装 MetaMask/Rabby 等注入式钱包。移动端可用钱包内置浏览器。
交易账户需先在 Hyperliquid 完成必要的开户和充值。本站不实现充值、提现、资金托管、会员数据库或双向对冲持仓。

## 网络依赖
行情及账户直接请求 api.hyperliquid.xyz 或 api.hyperliquid-testnet.xyz。
签名客户端按需从 esm.sh 加载固定版本 @nktkas/hyperliquid 0.33.3 与 viem 2.37.3；加载失败会阻止提交并显示错误。
生产环境建议经依赖审计后将这些依赖本地打包，配置内容安全策略，并完成真实浏览器与测试网验收。

## 验证及限制
纯计算验证覆盖多空盈亏、数量截断及价格精度。未使用用户钱包，未执行真实下单或测试网签名。接口、签名模块的运行情况仍需在可访问 Hyperliquid 和 esm.sh 的用户浏览器验收。
网络不确定时不自动重试订单，提醒先刷新持仓核对。签名前市场、网络、钱包及持仓会检查；钱包签名等待期间价格仍可能变化，实际成交以交易所结果为准。
Hyperliquid 持仓为净持仓；本界面在相反持仓存在时要求先平仓。标记价用于居中显示和盈亏，成交价由订单簿决定。

官方接口文档：https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api
SDK：https://github.com/nktkas/hyperliquid
