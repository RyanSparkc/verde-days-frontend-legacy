# Verde Days 後台系統設計（v1）

日期：2026-02-12  
範圍：同專案內建後台（`/login` + `/admin/*`）  
策略：垂直切片、品牌一致 UI、單一管理員帳號

## 1. 目標與決策摘要

本次後台採單一 React 專案延伸，不拆新 repo。原因是目前前台流程已穩定，直接共用既有環境、設計 token、狀態提示機制，能最快進入營運。後台 v1 一次涵蓋四模組：產品、訂單、優惠券、文章；但文章走分階段策略，先完成後台 CRUD，前台文章頁維持 static-first，待後台穩定後再切 API。

核心設計原則：
- 功能優先但保持品牌一致（高級、克制、低陰影）
- 每個模組可獨立驗收與回歸
- 錯誤處理一致，不讓使用者卡死在不可恢復狀態

## 2. 架構與資料流

路由新增：`/login`、`/admin/products`、`/admin/orders`、`/admin/coupons`、`/admin/articles`。`/admin/*` 由 `AdminLayout` 包裹，提供側欄、頁首、登出、共用 loading。未登入訪問後台時一律導向 `/login`。

認證流程基於 Hex API：
1. `POST /v2/admin/signin` 取得 token、expired
2. token 寫入 cookie，並設定 axios `Authorization`
3. 進入後台頁時呼叫 `POST /v2/api/{api_path}/user/check`
4. 失效則清 token、導回 `/login`

資料層新建 `src/services/admin/*`（products/orders/coupons/articles/auth/upload），前台 slice 與後台 service 分離，避免耦合。每個 CRUD 頁採相同互動模式：列表（分頁）→ modal 編輯/新增 → delete confirm → 成功後刷新當前頁。

## 3. 模組切片順序與 DoD

### M1 Auth + Admin Shell
- 交付：Login、Route Guard、AdminLayout、Logout
- 驗收：重新整理不掉登入、token 過期會被擋回登入

### M2 Products
- 交付：商品列表、建立/編輯/刪除、圖片上傳
- 欄位：沿用現有商品 schema（含 care fields）
- 驗收：後台新增啟用商品後，前台商品列表可見

### M3 Orders
- 交付：訂單列表、付款狀態切換、刪除
- 驗收：前台建立訂單後，後台可查詢並更新狀態

### M4 Coupons
- 交付：優惠券列表、建立/編輯、啟用開關、到期日、刪除
- 驗收：前台購物車可套用後台新建優惠券

### M5 Articles（分階段）
- 交付：文章後台 CRUD（含圖片、標籤、公開狀態）
- 驗收：API 可查詢新建文章；前台暫不切換資料源

## 4. 錯誤處理與驗證策略

- `401`：視為驗證失效，清 cookie + 回登入
- `4xx`：顯示可操作錯誤，保留使用者表單輸入
- `5xx`：顯示重試提示，避免重複送出

所有提交按鈕需具 loading/disabled；刪除必須二次確認；操作成功後保持當前分頁上下文。表單驗證由欄位規則與型別正規化雙層處理（價格、布林、日期、狀態），避免 UI 與 API 型別不一致。

## 5. 風險與控管

主要風險：
- API 欄位差異（特別是 coupon/article）
- 圖片上傳失敗造成資料不完整

對策：
- 先做 service adapter，統一 request/response mapping
- 每模組附最小驗證清單（登入、列表、CRUD、前台連動）
- 以小步 commit 推進：service/state/view 分層提交
