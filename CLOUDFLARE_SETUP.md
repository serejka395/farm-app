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

## 4. Page Rules (Required for SSL Generation)
**Go to Rules > Page Rules**
Click **Create Page Rule**.

**URL Pattern:**
`*yourdomain.com/.well-known/acme-challenge/*`
*(Replace `yourdomain.com` with your actual domain)*

**Settings:**
1. **SSL**: **Off**
2. **Cache Level**: **Bypass**
3. **Security Level**: **Essentially Off** (if available) or **Disable Performance**

**Why:** This allows Vercel to validate your SSL certificate via HTTP without Cloudflare interfering or redirecting to HTTPS endlessly during the challenge.
