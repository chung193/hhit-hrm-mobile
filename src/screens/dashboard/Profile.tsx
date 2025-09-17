// ProfileEdit.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { MainBackground } from '@components/background';
import { profile, updateUser, updateUserAvatar } from '@services/User';
import { UPLOAD_URL, MAIN_COLOR } from '../../config/app';
import * as ImagePicker from 'react-native-image-picker';
import { useGlobalContext } from '@providers/GlobalProvider';
import { PermissionsAndroid } from 'react-native';

type Asset = {
  uri?: string;
  type?: string;
  fileName?: string;
};

const ProfileEdit = () => {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showSnackbar, showLoading, hideLoading } = useGlobalContext();

  useEffect(() => {
    const run = async () => {
      try {
        showLoading?.();
        const res = await profile();
        setData(res.data.data);
      } catch (e) {
        console.log(e);
        showSnackbar?.('Không tải được hồ sơ', 'error');
      } finally {
        hideLoading?.();
      }
    };
    run();
  }, []);

  async function requestGalleryPermission() {
    if (Platform.OS !== 'android') return true;

    // Android 13+ cần READ_MEDIA_IMAGES, Android 12- cần READ_EXTERNAL_STORAGE
    const sdk = Number(Platform.Version);
    const perm =
      sdk >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(perm, {
      title: 'Quyền truy cập ảnh',
      message: 'Cho phép ứng dụng chọn ảnh từ thư viện.',
      buttonPositive: 'Cho phép',
      buttonNegative: 'Từ chối',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const handlePickImage = async () => {
    try {
      if (Platform.OS === 'android') {
        const ok = await requestGalleryPermission();
        if (!ok) {
          showSnackbar?.('Bạn chưa cấp quyền truy cập ảnh', 'warning');
          return;
        }
      }

      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.9,
      });

      // user bấm back/huỷ
      if (res.didCancel) return;

      // lỗi từ lib
      if (res.errorCode) {
        console.log('ImagePicker error:', res.errorCode, res.errorMessage);
        showSnackbar?.('Không mở được thư viện ảnh', 'error');
        return;
      }

      const asset = res.assets && res.assets[0];
      if (asset?.uri) {
        setData((prev: any) => ({
          ...prev,
          avatarLocal: asset.uri,   // preview
          _avatarAsset: asset,      // giữ để upload
        }));
      } else {
        showSnackbar?.('Không lấy được ảnh đã chọn', 'warning');
      }
    } catch (e) {
      console.log(e);
      showSnackbar?.('Đã xảy ra lỗi khi chọn ảnh', 'error');
    }
  };

  const handleUploadAvatar = async () => {
    if (!data?._avatarAsset?.uri) {
      showSnackbar?.('Chưa chọn ảnh đại diện mới', 'warning');
      return;
    }
    setUploading(true);
    try {
      // Chuẩn bị FormData đúng chuẩn
      const asset: Asset = data._avatarAsset;
      const name = asset.fileName || `avatar_${Date.now()}.jpg`;
      const type = asset.type || 'image/jpeg';
      const form = new FormData();
      form.append('avatar', {
        uri: asset.uri as string,
        name,
        type,
      } as any);

      await updateUserAvatar(data.id, form);
      // giả sử API sau khi update sẽ lấy lại tên file mới từ GET profile,
      // ở đây có thể gán tạm để hiển thị ngay:
      const refreshed = await profile();
      setData({
        ...refreshed.data.data,
        avatarLocal: undefined,
        _avatarAsset: undefined,
      });
      showSnackbar?.('Đã cập nhật ảnh đại diện', 'info');
    } catch (e) {
      console.log(e);
      showSnackbar?.('Cập nhật ảnh đại diện thất bại', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      // CHỈ cập nhật các field hồ sơ, KHÔNG gửi avatar ở đây nữa
      const payload = {
        email: data.email,        // nếu không cho sửa email thì bỏ trường này
        phone: data.phone ?? '',
        bd: data.bd ?? '',
        about: data.about ?? '',
        education: data.education ?? '',
      };
      await updateUser(data.id, payload);
      showSnackbar?.('Cập nhật thông tin thành công!', 'info');
    } catch (e) {
      console.log(e);
      showSnackbar?.('Có lỗi khi cập nhật thông tin', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  return (
    <MainBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
          <Image
            source={{
              uri: data.avatarLocal
                ? data.avatarLocal
                : `${UPLOAD_URL}/users/${data.avatar}`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.linkText}>Đổi ảnh</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{data.name}</Text>
        {!!data.position_name && (
          <Text style={styles.position}>{data.position_name}</Text>
        )}

        {data.avatarLocal && (
          <Button
            mode="contained"
            onPress={handleUploadAvatar}
            loading={uploading}
            style={{ marginTop: 10 }}
          >
            Lưu ảnh đại diện
          </Button>
        )}
      </View>

      <View style={styles.form}>
        {/* Nếu không muốn cho sửa email thì set disabled */}
        <TextInput
          label="Email"
          value={data.email ?? ''}
          onChangeText={(text) => setData({ ...data, email: text })}
          mode="outlined"
          style={[styles.input, { width: '100%' }]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Số điện thoại"
          value={data.phone ?? ''}
          onChangeText={(text) => setData({ ...data, phone: text })}
          mode="outlined"
          style={[styles.input, { width: '100%' }]}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Ngày sinh"
          value={data.bd ?? ''}
          onChangeText={(text) => setData({ ...data, bd: text })}
          mode="outlined"
          style={[styles.input, { width: '100%' }]}
          placeholder="YYYY-MM-DD"
        />
        <TextInput
          label="Tự bạch"
          value={data.about ?? ''}
          onChangeText={(text) => setData({ ...data, about: text })}
          mode="outlined"
          multiline
          textAlignVertical="top"
          contentStyle={{ minHeight: 120, paddingTop: 8 }}
          style={[styles.input, { width: '100%' }]}
          maxLength={2000}
        />
        <TextInput
          label="Quá trình học tập"
          value={data.education ?? ''}
          onChangeText={(text) => setData({ ...data, education: text })}
          mode="outlined"
          multiline
          textAlignVertical="top"
          contentStyle={{ minHeight: 120, paddingTop: 8 }}
          style={[styles.input, { width: '100%' }]}
          maxLength={4000}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 20 }}
        >
          Lưu thay đổi
        </Button>
      </View>
    </MainBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  linkText: {
    textAlign: 'center',
    color: MAIN_COLOR,
    marginTop: 6,
  },
  name: {
    textAlign: 'center',
    color: MAIN_COLOR,
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  position: {
    textAlign: 'center',
    color: MAIN_COLOR,
    marginTop: 4,
  },
  form: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
});

export default ProfileEdit;
