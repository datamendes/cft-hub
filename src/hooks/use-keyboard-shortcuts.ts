import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.shiftKey === !!shortcut.shiftKey &&
          !!event.altKey === !!shortcut.altKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Common shortcuts
export const createCommonShortcuts = (actions: {
  onNew?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onEscape?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.onNew) {
    shortcuts.push({
      key: 'n',
      ctrlKey: true,
      action: actions.onNew,
      description: 'Create new document'
    });
  }

  if (actions.onSave) {
    shortcuts.push({
      key: 's',
      ctrlKey: true,
      action: actions.onSave,
      description: 'Save current changes'
    });
  }

  if (actions.onSearch) {
    shortcuts.push({
      key: 'f',
      ctrlKey: true,
      action: actions.onSearch,
      description: 'Focus search'
    });
  }

  if (actions.onRefresh) {
    shortcuts.push({
      key: 'r',
      ctrlKey: true,
      action: actions.onRefresh,
      description: 'Refresh data'
    });
  }

  if (actions.onDelete) {
    shortcuts.push({
      key: 'Delete',
      action: actions.onDelete,
      description: 'Delete selected items'
    });
  }

  if (actions.onSelectAll) {
    shortcuts.push({
      key: 'a',
      ctrlKey: true,
      action: actions.onSelectAll,
      description: 'Select all items'
    });
  }

  if (actions.onEscape) {
    shortcuts.push({
      key: 'Escape',
      action: actions.onEscape,
      description: 'Close dialogs/clear selection'
    });
  }

  return shortcuts;
};