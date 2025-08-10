
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  percentages: number[]; // as 0..100 integers
  onChange: (values: number[]) => void;
}

export default function PercentageList({ percentages, onChange }: Props) {
  const handleChange = (index: number, val: string) => {
    const num = Math.max(0, Number(val.replace(/[^0-9.]/g, '')) || 0);
    const next = [...percentages];
    next[index] = num;
    onChange(next);
  };

  const handleAdd = () => {
    const next = [...percentages, 0];
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = percentages.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <View>
      {percentages.map((p, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.place}>Place {idx + 1}</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={String(p)}
              onChangeText={(t) => handleChange(idx, t)}
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9fb3d1"
              selectionColor={colors.accent}
            />
            <Text style={styles.percent}>%</Text>
            <TouchableOpacity
              onPress={() => handleRemove(idx)}
              style={[styles.removeBtn, { opacity: percentages.length <= 1 ? 0.5 : 1 }]}
              disabled={percentages.length <= 1}
              activeOpacity={0.7}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={handleAdd} style={styles.addBtn} activeOpacity={0.7}>
        <Text style={styles.addText}>+ Add place</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
  },
  place: {
    color: colors.text,
    marginBottom: 6,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    color: 'white',
    height: 42,
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  percent: {
    color: colors.text,
    fontWeight: '700',
    marginHorizontal: 4,
  },
  removeBtn: {
    backgroundColor: '#9a031e',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
  },
  removeText: {
    color: 'white',
    fontWeight: '700',
  },
  addBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
  },
  addText: {
    color: 'white',
    fontWeight: '800',
  },
});
