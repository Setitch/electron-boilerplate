import { Badge, Button, Card, Container, Group, Stack, Text, Title, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconBrandGithub, IconSparkles, IconBolt, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { NavigateFunction, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { TemplateScreen } from './template.screen';
import { useThemeColorScheme } from '../providers/theme.provider';

const SIZE = 296;


export function LandingScreen() {
  const navigate = useNavigate();
  const params = useParams();

  const theme = useMantineTheme();
  const { colorScheme } = useThemeColorScheme();

  return (
    <TemplateScreen bread={[]}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${theme.colors.current[8]} 0%, ${theme.colors.current[11]} 50%, ${theme.colors.current[12]} 100%)`,
          filter: 'blur(80px)',
          opacity: colorScheme === 'dark' ? 0.2 : 0.15,
        }} />
        <Container size="lg" style={{ position: 'relative' }}>
          <Stack align="center" gap="xl" style={{ textAlign: 'center', maxWidth: '64rem', margin: '0 auto' }}>
            <Title 
              order={1} 
              size="3.5rem" 
              style={{ 
                color: theme.colors.current[0], 
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '1.5rem',
              }}
            >
              App Title Here
            </Title>            
          </Stack>
        </Container>
      </TemplateScreen>
  );
}
