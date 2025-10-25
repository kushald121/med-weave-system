# Hospital Information Management System - Database Setup

## Important: You must run this SQL in your Supabase project!

Your app is now connected to your Supabase project at: `https://iculvdxvemhzoyankqay.supabase.co`

### Steps to complete setup:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/iculvdxvemhzoyankqay

2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar

3. **Copy the entire schema** from `user-uploads://schema.txt` and paste it into the SQL editor

4. **Run the SQL** to create all tables, indexes, and enums

5. **Set up Authentication**:
   - Go to Authentication > URL Configuration
   - Set **Site URL** to your app URL (current preview or deployed URL)
   - Add **Redirect URLs**: Add both your preview and deployed URLs

6. **Enable Row Level Security (RLS)** for all tables:
   - The schema doesn't include RLS policies yet
   - You'll need to add appropriate RLS policies based on your security requirements
   - Example policies needed:
     - Users can only see their own hospital_users records
     - Doctors can only see their assigned patients
     - Pharmacists can only see prescriptions for their hospital
     - Patients can only see their own data

### Example RLS Policies to Add:

```sql
-- Enable RLS on all tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_fulfillment ENABLE ROW LEVEL SECURITY;

-- Example: Hospital users can see their own records
CREATE POLICY "Users can view own hospital_user record"
  ON hospital_users FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Example: Doctors can see their patients
CREATE POLICY "Doctors can view their patients"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hospital_users hu
      WHERE hu.user_id::text = auth.uid()::text
      AND hu.hospital_id = patients.hospital_id
      AND hu.role = 'doctor'
      AND hu.deleted_at IS NULL
    )
  );
```

### Authentication Integration:

The app uses Supabase Auth with email/password. To test:

1. Create a test user via sign up in the app
2. Manually insert a record in `hospital_users` table to assign them a role:

```sql
INSERT INTO hospital_users (hospital_id, user_id, role, department)
VALUES (
  1,  -- Replace with your hospital ID
  'user-uuid-here',  -- Replace with the user's UUID from auth.users
  'doctor',  -- or 'admin', 'pharmacist', 'receptionist', 'patient'
  'Cardiology'
);
```

### Testing the App:

1. Sign up a new user through the app
2. Assign them a hospital_user role (as shown above)
3. Sign in and you'll be redirected to the appropriate dashboard

### Need Help?

- Check your Supabase logs for authentication errors
- Ensure your redirect URLs are correctly configured
- Verify RLS policies are not blocking legitimate queries
- Check the browser console for any errors

## Current Features:

✅ Multi-tenant hospital architecture
✅ Role-based authentication (Admin, Doctor, Pharmacist, Receptionist, Patient)
✅ Professional healthcare-themed design
✅ Role-specific dashboards with relevant widgets
✅ Complete TypeScript types matching your schema
✅ Responsive layouts with sidebar navigation

## Next Steps (to be implemented):

- Patient registration workflow
- Visit/consultation management
- Prescription creation and fulfillment
- Inventory management
- Appointment scheduling
- Medical records and history
- Reports and analytics
- Hospital settings management
