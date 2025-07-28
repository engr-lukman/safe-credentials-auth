# Safe Credentials Auth

A modern Vue 3 + Vite application for secure authentication with robust password policies and form validation.

## Features

- **Login Form**: Email and password fields with real-time validation.
- **Password Policy**: Enforces minimum length, uppercase, lowercase, number, and special character requirements.
- **Reusable Components**:
  - `TextField`: Customizable text input.
  - `PasswordField`: Secure password input with policy feedback.
  - `PrimaryButton`: Styled button with loading state.
  - `MaterialIcon`: Icon component for UI consistency.
- **Form Validation**: Powered by Vuelidate, with custom rules and error messages.
- **Tailwind CSS**: Utility-first styling for rapid UI development.

## Project Structure

```
src/
  App.vue                # Main app with login form
  assets/                # Static assets (logo, CSS)
  components/            # UI components
  composables/           # Custom composables (form validation)
  utils/                 # Constants, messages, regex
  main.js                # App entry point
```

## Getting Started

### Install dependencies

```sh
npm install
```

### Run for development

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

## Customization

- **Password Policy**: Edit `src/utils/constants.js` to adjust password requirements.
- **Validation Messages**: Update `src/utils/messages.js` for custom error texts.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
