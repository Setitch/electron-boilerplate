import { useState, useRef, useEffect } from 'react';
import { TextInput, ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface InlineEditableProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  showEditIcon?: boolean;
  className?: string;
}

export function InlineEditable({ 
  value, 
  onSave, 
  placeholder = 'Click to edit...', 
  size = 'sm',
  disabled = false,
  showEditIcon = true,
  className,
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleEditClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Group gap="xs" align="center">
        <TextInput
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          size={size}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <ActionIcon size="xs" variant="light" color="green" onClick={handleSave}>
          <IconCheck size={12} />
        </ActionIcon>
        <ActionIcon size="xs" variant="light" color="red" onClick={handleCancel}>
          <IconX size={12} />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <Group gap="xs" align="center" className={className}>
      <Text 
        size={size} 
        onDoubleClick={handleDoubleClick}
        style={{ 
          cursor: disabled ? 'default' : 'pointer',
          flex: 1,
          minHeight: '1.5em',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {value || placeholder}
      </Text>
      {showEditIcon && !disabled && (
        <ActionIcon 
          size="xs" 
          variant="subtle" 
          color="gray" 
          onClick={handleEditClick}
          style={{ opacity: 0.6 }}
        >
          <IconEdit size={12} />
        </ActionIcon>
      )}
    </Group>
  );
} 