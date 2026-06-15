import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  Chip,
  Divider,
  InputAdornment,
  Grid,
  PageHeader,
} from '@sprintpulse/component';
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useAdminKeyframes } from '@sprintpulse/hooks';
import { useStyles } from './styles/HelpSupport.styles';
import { FAQ_DATA, QUICK_LINKS, CHAT_SUGGESTIONS } from '../../../utils/mockData';

// ── Main Help & Support Component ─────────────────────────────────────────────
const HelpSupport = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleOpenChatBot = () => {
    window.dispatchEvent(new CustomEvent('openChatBot'));
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Filter FAQs based on search
  const filteredFaqs = searchQuery.trim()
    ? FAQ_DATA.map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      })).filter((category) => category.questions.length > 0)
    : FAQ_DATA;

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page Header */}
        <PageHeader
          title='Help & Support'
          description='Find answers, contact support, and get assistance with our AI chatbot'
          icon={HelpOutlineIcon}
          variant='admin'
        />

        {/* Search Bar */}
        <Paper className={classes.searchBar} elevation={0}>
          <TextField
            fullWidth
            placeholder='Search for help articles, FAQs, or topics...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            size='small'
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: '#64748b', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position='end'>
                  <Button
                    size='small'
                    onClick={() => setSearchQuery('')}
                    sx={{ minWidth: 'auto', p: 0.5, color: '#64748b' }}
                  >
                    Clear
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Quick Actions Section */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>Quick Actions</Typography>
          <Grid container spacing={1}>
            {QUICK_LINKS.map((link, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper
                  className={classes.quickActionCard}
                  elevation={0}
                  onClick={link.title === 'Live Chat' ? handleOpenChatBot : undefined}
                  sx={{ cursor: link.title === 'Live Chat' ? 'pointer' : 'default' }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: link.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Box sx={{ color: link.color, '& .MuiSvgIcon-root': { fontSize: 22 } }}>
                      {link.icon}
                    </Box>
                  </Box>
                  <Typography fontWeight={700} fontSize='0.88rem' color='text.primary'>
                    {link.title}
                  </Typography>
                  <Typography fontSize='0.75rem' color='text.secondary' mt={0.5}>
                    {link.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Cards */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>Contact Information</Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper className={`${classes.contactCard} ${classes.contactCard0}`} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'rgba(79,70,229,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmailIcon sx={{ color: '#4f46e5', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography fontSize='0.65rem' color='text.secondary' fontWeight={600}>
                      Email Support
                    </Typography>
                    <Typography fontWeight={700} fontSize='0.95rem'>
                      support@sprintpulse.tech
                    </Typography>
                    <Typography fontSize='0.72rem' color='text.disabled'>
                      Response within 24 hours
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper className={`${classes.contactCard} ${classes.contactCard1}`} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'rgba(5,150,105,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PhoneIcon sx={{ color: '#059669', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography fontSize='0.65rem' color='text.secondary' fontWeight={600}>
                      Phone Support
                    </Typography>
                    <Typography fontWeight={700} fontSize='0.95rem'>
                      +91 1800-XXX-XXXX
                    </Typography>
                    <Typography fontSize='0.72rem' color='text.disabled'>
                      Mon-Fri, 9 AM - 6 PM IST
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* AI Chat Assistant Card */}
        <Card className={classes.chatAssistantCard} elevation={0}>
          <Box className={classes.chatAssistantContent}>
            <Box className={classes.chatAssistantLeft}>
              <Box className={classes.botAvatar}>
                <SmartToyIcon sx={{ fontSize: 28, color: '#fff' }} />
                <Box className={classes.onlineIndicator} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize='1.05rem'>
                  AI Assistant Available 24/7
                </Typography>
                <Typography fontSize='0.82rem' color='text.secondary' mt={0.5}>
                  Get instant help from our AI chatbot for common queries, troubleshooting, and
                  guidance.
                </Typography>
              </Box>
            </Box>
            <Button
              variant='contained'
              startIcon={<SmartToyIcon />}
              onClick={handleOpenChatBot}
              className={classes.chatButton}
            >
              Open AI Assistant
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={700} fontSize='0.78rem' color='text.secondary' mb={1.5}>
            Try asking
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {CHAT_SUGGESTIONS.map((suggestion, idx) => (
              <Chip
                key={idx}
                label={suggestion.text}
                size='small'
                icon={
                  <Typography sx={{ fontSize: '0.9rem', ml: 0.5 }}>{suggestion.icon}</Typography>
                }
                onClick={handleOpenChatBot}
                sx={{
                  height: 30,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: 'rgba(99,102,241,0.06)',
                  color: '#4f46e5',
                  border: '1px solid rgba(99,102,241,0.15)',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(99,102,241,0.12)',
                    borderColor: 'rgba(99,102,241,0.3)',
                  },
                }}
              />
            ))}
          </Box>
        </Card>

        {/* FAQ Section */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>Frequently Asked Questions</Typography>
          {filteredFaqs.length === 0 ? (
            <Paper className={classes.noResults} elevation={0}>
              <Typography fontWeight={600} color='text.secondary'>
                No results found for "{searchQuery}"
              </Typography>
              <Typography fontSize='0.82rem' color='text.disabled' mt={0.5}>
                Try a different search term or browse all categories
              </Typography>
              <Button size='small' onClick={() => setSearchQuery('')} sx={{ mt: 1.5 }}>
                Clear Search
              </Button>
            </Paper>
          ) : (
            filteredFaqs.map((category) => (
              <Box key={category.category} className={classes.faqCategory}>
                <Box className={classes.faqCategoryHeader}>
                  <Typography sx={{ fontSize: '1.1rem' }}>{category.icon}</Typography>
                  <Typography fontWeight={700} fontSize='0.88rem' color='text.primary'>
                    {category.category}
                  </Typography>
                </Box>
                {category.questions.map((item, idx) => {
                  const faqId = `${category.category}-${idx}`;
                  return (
                    <Accordion
                      key={idx}
                      expanded={expandedFaq === faqId}
                      onChange={() => toggleFaq(faqId)}
                      className={classes.faqAccordion}
                      disableGutters
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: '#4f46e5' }} />}
                        className={classes.faqAccordionSummary}
                      >
                        <Typography fontWeight={600} fontSize='0.85rem'>
                          {item.q}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className={classes.faqAccordionDetails}>
                        <Typography
                          component='p'
                          fontSize='0.82rem'
                          color='text.secondary'
                          sx={{ lineHeight: 1.7 }}
                        >
                          {item.a}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            ))
          )}
        </Box>

        {/* Need More Help Section */}
        <Paper className={classes.needHelpCard} elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography fontWeight={700} fontSize='1rem'>
                Still need help?
              </Typography>
              <Typography fontSize='0.82rem' color='text.secondary' mt={0.25}>
                Our support team is here to assist you with any questions or issues.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button
                variant='outlined'
                startIcon={<EmailIcon />}
                onClick={() => window.open('mailto:support@sprintpulse.tech', '_blank')}
                className={`${classes.needHelpButton} ${classes.needHelpButtonOutlined}`}
              >
                Email Us
              </Button>
              <Button
                variant='contained'
                startIcon={<SmartToyIcon />}
                onClick={handleOpenChatBot}
                className={`${classes.needHelpButton} ${classes.needHelpButtonContained}`}
              >
                Chat Now
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default HelpSupport;
