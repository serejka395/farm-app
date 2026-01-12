# Cloudflare Configuration for Vercel (Russia Fix)

## 1. SSL/TLS Configuration (CRITICAL)
**Go to SSL/TLS > Overview**
- Set encryption mode to: **Full (Strict)**
- *Why:* Prevents "Too Many Redirects" (ERR_TOO_MANY_REDIRECTS) loop between Cloudflare and Vercel.

## 2. DNS Records
**Go to DNS > Records**
Delete any existing A/CNAME records for your root domain. Add these exactly:

| Type | Name | Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | **Proxied** (Orange Cloud) 🧡 |
| **CNAME** | `www` | `cname.vercel-dns.com` | **Proxied** (Orange Cloud) 🧡 |

*The "Proxied" (Orange Cloud) status is mandatory to bypass blocks.*

## 3. Important Settings
**Go to SSL/TLS > Edge Certificates**
- **Always Use HTTPS**: **On** (Recommended)
- **Automatic HTTPS Rewrites**: **On**

**Go to Network**
- **WebSockets**: **On** (Required for some Vercel features)
