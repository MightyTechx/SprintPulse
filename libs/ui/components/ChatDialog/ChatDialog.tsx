import { useState, FC, useCallback } from 'react';
import { Box, IconButton, Typography, TextField, Paper, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useStyles } from './styles/ChatDialog.styles';
import { sendChatMessage } from '../../services/chatApi';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChatDialog: FC<ChatDialogProps> = ({ open, onClose }) => {
  const { classes, cx } = useStyles();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Sprint Pulse AI assistant, specialized in wind turbine operations and energy management.\n\nI can help you with:\n• Turbine performance and power generation\n• SCADA parameters and monitoring\n• Maintenance schedules and troubleshooting\n• Reports and analytics\n\nWhat would you like to know about today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'Show turbine status',
        'How to improve power output?',
        'Maintenance schedule',
        'Common turbine issues',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send to backend API
      const response = await sendChatMessage(input, messages);
      const aiResponse: Message = {
        id: messages.length + 2,
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to error message
      const errorResponse: Message = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support'],
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <Box className={classes.overlay} onClick={onClose}>
      <Paper className={classes.dialog} onClick={(e) => e.stopPropagation()} elevation={24}>
        {/* Header */}
        <Box className={classes.header}>
          <Box className={classes.headerLeft}>
            <Box className={classes.aiIconContainer}>
              <SmartToyIcon className={classes.aiIcon} />
              <Box className={classes.pulseRing} />
              <Box className={classes.pulseRingDelay} />
            </Box>
            <Box>
              <Typography className={classes.title}>AI Assistant</Typography>
              <Box className={classes.statusIndicator}>
                <Box className={classes.statusDot} />
                <Typography className={classes.statusText}>Online</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton className={classes.closeButton} onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages Area */}
        <Box className={classes.messagesContainer}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              className={cx(
                classes.messageWrapper,
                msg.isUser ? classes.userMessageWrapper : classes.aiMessageWrapper,
              )}
            >
              {!msg.isUser && (
                <Box className={classes.avatarContainer}>
                  <SmartToyIcon className={classes.messageAvatarIcon} />
                </Box>
              )}
              <Box
                className={cx(
                  classes.messageBubble,
                  msg.isUser ? classes.userBubble : classes.aiBubble,
                )}
              >
                <Typography className={classes.messageText}>{msg.text}</Typography>
                <Typography className={classes.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {!msg.isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <Box className={classes.suggestionsContainer}>
                    {msg.suggestions.map((suggestion, idx) => (
                      <Chip
                        key={idx}
                        label={suggestion}
                        icon={<AutoAwesomeIcon style={{ fontSize: 12 }} />}
                        className={classes.suggestionChip}
                        onClick={() => {
                          setInput(suggestion);
                        }}
                        size='small'
                      />
                    ))}
                  </Box>
                )}
              </Box>
              {msg.isUser && (
                <Box className={classes.avatarContainer}>
                  <PersonIcon className={classes.messageAvatarIconUser} />
                </Box>
              )}
            </Box>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <Box className={classes.aiMessageWrapper}>
              <Box className={classes.avatarContainer}>
                <SmartToyIcon className={classes.messageAvatarIcon} />
              </Box>
              <Box className={cx(classes.messageBubble, classes.aiBubble)}>
                <Box className={classes.typingIndicator}>
                  <span className={classes.typingDot} />
                  <span className={classes.typingDot} />
                  <span className={classes.typingDot} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box className={classes.inputArea}>
          <TextField
            className={classes.inputField}
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            variant='outlined'
          />
          <IconButton
            className={cx(classes.sendButton, !input.trim() && classes.sendButtonDisabled)}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Decorative elements */}
        <Box className={classes.gridOverlay} />
        <Box className={classes.glowOrb1} />
        <Box className={classes.glowOrb2} />
      </Paper>
    </Box>
  );
};

export default ChatDialog;
