# Address Management in Registration Form

## Overview
The registration form now supports adding multiple addresses during user registration, similar to the user creation and editing forms in the admin panel.

## Features

### 1. Address Management UI
- **Add Addresses**: Users can add multiple addresses during registration
- **Remove Addresses**: Users can remove addresses before submitting
- **Validation**: Address fields (street, city, postal code) are validated
- **Optional**: Addresses are completely optional during registration

### 2. Form Structure
The registration form now includes:
- Basic user information (name, email, password)
- Profile image upload (optional)
- Address management section (optional)

### 3. Address Fields
Each address contains:
- **Calle** (Street): Required when adding an address
- **Localidad** (City): Required when adding an address  
- **CP** (Postal Code): Required when adding an address

### 4. Data Flow

#### Frontend → Backend
```typescript
{
  nombre: "John Doe",
  email: "john@example.com", 
  password: "password123",
  imagenPerfilPublicId: "cloudinary_id", // optional
  direcciones: [ // optional
    {
      calle: "123 Main St",
      localidad: "New York", 
      cp: "10001"
    },
    {
      calle: "456 Oak Ave",
      localidad: "Los Angeles",
      cp: "90210" 
    }
  ]
}
```

#### Backend Processing
The backend should:
1. Create the user with basic information
2. For each address in the `direcciones` array:
   - Create a `Direccion` entity
   - Create a `UsuarioDireccion` relationship linking the user to the address
3. Return the user with token for immediate login

### 5. Validation Rules
- **User fields**: Name, email, and password are required
- **Address fields**: If addresses are provided, all fields (street, city, postal code) are required
- **Image**: Profile image is optional

### 6. Error Handling
- Form validation errors are displayed inline
- API errors are shown using SweetAlert2
- Network errors are handled gracefully

## Implementation Notes

### Frontend Changes
1. **Register.tsx**: Added address management UI and form fields
2. **Register.module.css**: Added styles for address section
3. **usuarioHTTP.ts**: Updated to send addresses in registration payload
4. **IUsuario.ts**: Already supports direcciones field

### Backend Requirements
The backend `/public/register` endpoint should:
1. Accept the `direcciones` array in the request body
2. Create the user first
3. Create addresses and link them to the user
4. Return the user with authentication token

### Testing
To test the functionality:
1. Fill out the registration form
2. Add one or more addresses
3. Submit the form
4. Verify that the user is created with addresses linked
5. Check that the user can log in immediately after registration

## Future Enhancements
- Address validation (postal code format, etc.)
- Address autocomplete using external APIs
- Default address selection
- Address editing after registration 