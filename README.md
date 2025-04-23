## ✅ Contributing to This Branch

We work collaboratively on this project with discipline and accountability.  
**No direct commits to this branch will be allowed, to avoid conflicts and breaking the code. I have made it a protected branch**  
All work has to go through the structured process below.

---

### 🔒 Protected Branches

- The following branches are **protected**:  
  `main` and `astro`
- You **cannot push directly** to these branches
- All changes must be submitted via **Pull Requests (PRs)**

---

### 🛠️ How to Contribute

1. **Open an Issue**
   - Every change must be tied to a GitHub Issue
   - Clearly describe the bug, feature, or task

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/issue-42-login-validation
   ```

3. **Make Changes**
   - Commit with clear messages
   ```bash
   git commit -m "Fix: Validate login with new rule"
   ```

4. **Push & Open a Pull Request**
   - Title or description must link to the issue:
     ```
     Fixes #42 – Implemented login validation
     ```

5. **Get Peer Reviews**
   - At least one team member must approve your PR

6. **Pass CI Checks**
   - Your code must pass all automated tests and checks

---

### 🚦 Pull Request Requirements

- **Must reference an Issue** using GitHub syntax:
  ```
  Fixes #<issue-number>, or Closes #<issue-number>
  ```
- Must be **peer reviewed**
- Must resolve all **review conversations**
- Must not contain **merge conflicts**

---

### 💡 Best Practices

- Keep PRs **small and focused**
- Write **clear commit messages**
- Leave **comments** on complex logic
- Always **test** your changes locally.

---

### 🚫 Don’t

- ❌ Don’t push to `astro` or `main`
- ❌ Don’t merge PRs without linking an Issue
- ❌ Don’t ignore code review feedback

---

### 📬 Need Help?

Open an Issue labeled `question` or tag a maintainer.

---

### 🧙‍♂️ Pro Tip

Pull Requests with no linked Issue will be **blocked or rejected**.
