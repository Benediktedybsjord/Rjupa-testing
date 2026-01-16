## Firestore Data Model

### users/{uid}

**What it is: User profile + credits
**Created: First login
**Write access: User (restricted by rules)

**Fields**

* `createdAt` (timestamp)
* `credits` (number)
* `displayName` (string, optional)

---

### users/{uid}/tests/{testId}

**What it is: One shot test result
**Created: After analysis
**Write access: User (owner only)

**Fields**

* `createdAt` (timestamp)
* `analysisVersion` (string)
* `shotDistanceMeters` (number, always `28`)
* `weapon` (string)
* `choke` (string)
* `cartridgeId` (string, optional)
* `cartridge` (object)
* `counts` (object)
* `metrics` (object)
* `quality` (object)

---

### cartridges/{cartridgeId}

**What it is: Cartridge catalog (read-only)
**Created: Manually or via script
**Write access: Admin only

**Fields**

* `brand` (string)
* `material` (string)
* `loadGrams` (number)
* `norwegianNo` (number)
* `usNo` (number)
* `pelletDiameterMm` (number)
* `pelletCount` (number)

---

### payments/{paymentId}

**Whatit is: Payment + credit log
**Created: Server only
**Write access: Server only

**Fields**

* `uid` (string)
* `provider` (string)
* `providerRef` (string)
* `packSize` (number)
* `amount` (number)
* `currency` (string)
* `status` (string)
* `createdAt` (timestamp)
* `verifiedAt` (timestamp, optional)

---