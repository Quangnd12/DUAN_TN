import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEventQuery } from "../../../../../../redux/slice/eventSlice";
import DOMPurify from "dompurify";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  AccessTime,
  LocationOn,
  Category,
  ArrowBack,
  Share,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: event, isLoading, error } = useGetEventQuery(id);
  const [headings, setHeadings] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [isFeaturedArtistsOpen, setIsFeaturedArtistsOpen] = useState(true);
  const contentRef = useRef(null);
  const sectionNavRef = useRef(null);
  
  useEffect(() => {
    if (event?.description && contentRef.current) {
      const extractedHeadings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3")
      ).map((heading, index) => ({
        id: `section-${index}`,
        text: heading.textContent,
        level: heading.tagName.toLowerCase(),
      }));

      setHeadings(extractedHeadings);
    }
  }, [event?.description]);

  // Intersection Observer for sticky navigation
  useEffect(() => {
    if (!contentRef.current || !sectionNavRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px",
        threshold: 0.5,
      }
    );

    // Observe all sections
    const sections = contentRef.current.querySelectorAll("h1, h2, h3");
    sections.forEach((section, index) => {
      section.id = `section-${index}`;
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [event?.description]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.name,
          text: `Check out this amazing event: ${event.name}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Event link copied to clipboard!"));
    }
  };


  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading event details</Typography>;
  if (!event) return null;

  const sanitizedDescription = DOMPurify.sanitize(event.description);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {event.name}
        </Typography>
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {/* Sidebar Navigation */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            {/* Artist Section with Collapsible */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => setIsFeaturedArtistsOpen(!isFeaturedArtistsOpen)}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="h6" gutterBottom>
                Featured Artists
              </Typography>
              {isFeaturedArtistsOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
            <Collapse in={isFeaturedArtistsOpen}>
              {event.artists?.map((artist) => (
                <Box key={artist.id} display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{ width: 40, height: 40, mr: 2 }}
                    alt={artist.name}
                    src={artist.avatar || "/default-artist.jpg"}
                  />
                  <Typography variant="subtitle1">{artist.name}</Typography>
                </Box>
              ))}
            </Collapse>
          </Paper>

          {/* Sticky Event Sections */}
          <Paper
            ref={sectionNavRef}
            elevation={3}
            sx={{
              p: 2,
              position: "sticky",
              top: 16,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              zIndex: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Event Sections
            </Typography>
            {headings.map((heading) => (
              <Button
                key={heading.id}
                fullWidth
                className="section-nav-button text-left"
                sx={{
                  justifyContent: "flex-start",
                  my: 0.5,
                  fontWeight: activeSection === heading.id ? "bold" : "normal",
                  color: activeSection === heading.id ? "primary.main" : "inherit",
                  pl: heading.level === "h3" ? 2 : 0,
                }}
                onClick={() => scrollToSection(heading.id)}
              >
                {heading.text}
              </Button>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Event Header */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                icon={<AccessTime />}
                label={`Starts: ${new Date(event.startTime).toLocaleString()}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<LocationOn />}
                label={event.location}
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<Category />}
                label={event.eventCategory}
                color="success"
                variant="outlined"
              />
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                alt={event.createdByUsername}
                src="/default-avatar.jpg"
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2" color="text.secondary">
                Created by: <strong>{event.createdByUsername}</strong>
              </Typography>
            </Box>
          </Paper>

          {/* Rich Text Description */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Event Description
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              className="ck-content"
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetail;
