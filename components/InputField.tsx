
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { StyleSheet as RNStyleSheet } from 'react-native';

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
  keyboard?: 'number-pad' | 'decimal-pad' | 'default';
  prefix?: string;
  step?: number;
}

export default function InputField({ label, value, onChange, keyboard = 'default', prefix, step = 1 }: Props) {
  const toNumber = (str: string) => {
    // Only allow digits and optionally one dot
    const cleaned = str.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return Number(`${parts[0]}.${parts.slice(1).join('')}`) || 0;
    }
    return Number(cleaned) || 0;
  };

  const handleMinus = () => {
    const newVal = value - step;
    onChange(Number.isInteger(step) ? Math.max(0, Math.round(newVal)) : Math.max(0, parseFloat(newVal.toFixed(2))));
  };
  const handlePlus = () => {
    const newVal = value + step;
    onChange(Number.isInteger(step) ? Math.max(0, Math.round(newVal)) : Math.max(0, parseFloat(newVal.toFixed(2))));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={handleMinus} style={styles.stepperBtn} activeOpacity={0.7}>
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
          <TextInput
            style={styles.input}
            keyboardType={keyboard === 'default' ? 'default' : 'numeric'}
            value={String(value)}
            onChangeText={(t) => onChange(toNumber(t))}
            placeholderTextColor="#9fb3d1"
            selectionColor={colors.accent}
          />
        </View>

        <TouchableOpacity onPress={handlePlus} style={styles.stepperBtn} activeOpacity={0.7}>
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    color: colors.text,
    marginBottom: 6,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
  },
  stepperText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
  },
  prefix: {
    color: colors.text,
    marginRight: 6,
    opacity: 0.9,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
  },
});
