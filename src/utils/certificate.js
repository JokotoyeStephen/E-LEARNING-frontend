// Builds the URL for LinkedIn's "Add to Profile" certification deep link —
// LinkedIn reads these query params to pre-fill the Licenses & Certifications
// section on the user's profile.
export function buildLinkedInAddUrl({ courseTitle, completedAt, certificateId }) {
  const d = completedAt ? new Date(completedAt) : new Date()
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: courseTitle || 'Learnly Course',
    organizationName: 'Learnly',
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: buildVerifyUrl(certificateId),
    certId: certificateId || '',
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

export function buildVerifyUrl(certificateId) {
  return `${window.location.origin}/verify/${certificateId}`
}
