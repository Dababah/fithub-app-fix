import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Modal, Form, Button } from "react-bootstrap";
import memberService from '../../services/memberService';
import moment from 'moment';
import mainBg from '../../assets/images/5.jpeg';
import defaultProfile from '../../assets/images/9.jpeg';

export default function MemberDashboard() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileRes = await memberService.getMemberProfile();
      const attendanceRes = await memberService.getMemberAttendance();
      setProfile(profileRes.data);
      setAttendance(attendanceRes.data);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data member.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      setError("Pilih file gambar terlebih dahulu.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      await memberService.uploadProfileImage(formData);
      await fetchMemberData(); // Muat ulang data
      setShowImageModal(false);
      setProfileImage(null);
    } catch (e) {
      console.error(e);
      setError("Gagal mengunggah foto profil. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => { fetchMemberData(); }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundImage: `url(${mainBg})`, backgroundSize: 'cover' }}>
      <Container className="py-5">
        <h3 className="text-center mb-4">Dasbor Member</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <Row>
            {profile && (
              <Col md={6}>
                <Card className="p-4">
                  <div className="text-center position-relative">
                    <img
                      src={profile.profilePictureUrl ? `http://localhost:4000${profile.profilePictureUrl}?t=${Date.now()}` : defaultProfile}
                      alt="Profil"
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0d6efd' }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute bottom-0 end-0"
                      onClick={() => setShowImageModal(true)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                  </div>
                  <h4 className="mt-3 text-center">{profile.fullName}</h4>
                  <p>Email: {profile.email}</p>
                  <p>Telepon: {profile.phone}</p>
                </Card>
              </Col>
            )}
          </Row>
        )}

        <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Unggah Foto Profil</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleImageUpload}>
            <Modal.Body>
              <Form.Group controlId="formFile">
                <Form.Label>Pilih Gambar</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowImageModal(false)}>Batal</Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? <Spinner animation="border" size="sm" /> : "Unggah"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}
