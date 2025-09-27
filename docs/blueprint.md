# **App Name**: MediCompass

## Core Features:

- Secure User Authentication: Implement patient and doctor authentication using Supabase, including login/signup and secure route protection.
- Prescription Analysis: Allow users to upload prescription files (e.g., images or PDFs), submit them to the AI Analysis API (HuggingFace/OpenAI), and present a structured overview of the extracted medical information. Use AI as a tool to decide whether or not to present potential drug interactions or dosage concerns.
- Prescription Validation: Cross-reference analyzed prescription data with the Google Cloud Healthcare API to validate prescriptions, flag potential errors, and ensure compliance.
- Doctor Consultation: Integrate with a Doctor Consultation API to connect patients with available healthcare professionals for virtual consultations.
- Geolocation Services: Utilize a Geolocation API to identify and display nearby hospitals and pharmacies based on the user's current location.
- Medication Price Comparison: Integrate with a Medication Price Comparison API to fetch and present real-time pricing data from local pharmacies.
- Home Dashboard: Provide users with a personalized dashboard displaying key medical information, upcoming appointments, and quick access to core features.

## Style Guidelines:

- Primary color: Vivid blue (#3498DB) to convey trust and clarity in healthcare information.
- Background color: Light blue (#EBF5FB), providing a calm, clean backdrop for medical data.
- Accent color: Green (#2ECC71) for positive affirmations, validations, and calls to action.
- Body and headline font: 'Inter' sans-serif for clear, accessible readability across devices.
- Code font: 'Source Code Pro' for displaying API responses or code snippets, such as error logs.
- Use a set of minimalist, professional icons to represent each section and feature, enhancing visual navigation.
- Implement a card-based layout with rounded corners to organize information clearly and create an intuitive, user-friendly interface.