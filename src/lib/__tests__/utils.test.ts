diff --git a//dev/null b/src/lib/__tests__/utils.test.ts
index 0000000000000000000000000000000000000000..039cfe570c61a200ef4a5fb66105ab1d5418d782 100644
--- a//dev/null
+++ b/src/lib/__tests__/utils.test.ts
@@ -0,0 +1,12 @@
+import { describe, it, expect } from "bun:test"
+import { cn } from "../utils"
+
+describe("cn", () => {
+  it("combines classes", () => {
+    expect(cn("foo", "bar")).toBe("foo bar")
+  })
+
+  it("merges conflicting tailwind classes", () => {
+    expect(cn("p-2", "p-4")).toBe("p-4")
+  })
+})
