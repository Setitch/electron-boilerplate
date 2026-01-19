import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Anchor, Breadcrumbs, Container, Group, Text, Title, useMantineTheme } from '@mantine/core';

import { ModeToggle } from '../components/theme-switcher/mode-toggle';
import { useThemeColorScheme } from '../providers/theme.provider';

type Props = {
  children: ReactNode;
  bread: {title: string | string[] ; href?: string}[];
}

export function TemplateScreen({ children, bread }: Props) {
    const { id } = useParams();
    const theme = useMantineTheme();
    const { colorScheme } = useThemeColorScheme();

    return (
        <div style={{ 
            minHeight: '90vh',
            background: theme.colors.current[6], // Pure black for dark, pure white for light
          }}>
            <header style={{
              borderBottom: `1px solid ${theme.colors.current[14]}`,
              backdropFilter: 'blur(8px)',
              backgroundColor: theme.colors.current[5], // Pure black for dark, pure white for light - matches window borders
            }}>
              <Container size="lg" py="md">
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                  
                    <Title order={1} size="xl" style={{ color: theme.colors.current[0], fontWeight: 700 }}>
                      { /* ToDO - make it better */ }
                      <Breadcrumbs>
                        {(bread || []).map((x, index) => {
                          const titleText = Array.isArray(x.title) ? x.title.join(': ') : x.title;

                          return x.href ? (
                            <Anchor 
                              href={x.href}
                              key={index}
                              underline="always"
                              style={{ 
                                cursor: 'pointer',
                                color: theme.colors.current[0],
                              }}
                            >
                              {titleText}
                            </Anchor>
                          ) : (
                            <Text 
                              component="span"
                              key={index}
                              style={{ 
                                color: theme.colors.current[0],
                              }}
                            >
                              {titleText}
                            </Text>
                          );
                        })}
                      </Breadcrumbs>
                    </Title>
                  </Group>
                  <ModeToggle />
                </Group>
              </Container>
            </header>

            <section style={{ 
                position: 'relative',
                padding: '1rem 0',
                overflow: 'hidden',
            }}>
                {children}
            </section>
            <footer>

            </footer>
        </div>      
    );
}
