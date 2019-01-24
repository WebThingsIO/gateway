#!/bin/bash -e
#
# Script which will resize a filesystem and also copy the new smaller
# filesystem onto your local machine.
#
# Example: shrink.fs /dev/sdd gateway-0.5.0.img 3000
#
# The last argument is optional and specifies the desired size of the
# resized filesystem in megabytes. If not provided, it will default to 3000.
#
# 2400 is suitable for use with the headless (lite) image. You'll need to
# use something much larger (4096?) for the full image.

SCRIPT_NAME=$(basename $0)

usage() {
  echo "Usage: ${SCRIPT_NAME} dd-device img-filename [new-size]"
}

DD_DEV="$1"
if [ -z "${DD_DEV}" ]; then
  usage
  exit 1
fi

IMG_FILENAME="$2"
if [ -z "${IMG_FILENAME}" ]; then
  usage
  exit 1
fi
DD_NAME=$(basename ${DD_DEV})
if [[ "${DD_DEV:0:1}" != '/' ]]; then
  DD_DEV="/dev/${DD_DEV}"
fi
REMOVABLE=$(cat /sys/block/${DD_NAME}/removable)
if [ "${REMOVABLE}" != "1" ]; then
  echo "${DD_DEV} isn't a removable drive"
  exit 1
fi
MEDIA_SIZE=$(cat /sys/block/${DD_NAME}/size)
if [ "${MEDIA_SIZE}" == "0" ]; then
  echo "No media present at ${DD_DEV}"
  exit 1
fi
if [ $(( ${MEDIA_SIZE} / 2048 / 1024 )) -gt 100 ]; then
  echo "${DD_DEV} media size is larger than 100 Gb - wrong device?"
  exit 1
fi

NEW_SIZE_M="$3"
if [ -z "${NEW_SIZE_M}" ]; then
  NEW_SIZE_M=3000
fi

DEV_PART2=${DD_DEV}2

# Unmount anything on the source device
mount | grep "${DD_DEV}" | while read dev rest; do
  echo "Unmounting '${dev}'"
  sudo umount "${dev}"
done

# Verify that the filesystem is good
sudo e2fsck -f ${DEV_PART2}

# Make the filesystem itself smaller
sudo resize2fs ${DEV_PART2} ${NEW_SIZE_M}M

# Calculate what the new smaller partition size will be
FDISK_PART2="$(fdisk -l ${DD_DEV} | grep ${DEV_PART2} | tr -s ' ')"
PART2_START="$(echo ${FDISK_PART2} | cut -d ' ' -f 2)"
PART2_END="$(echo ${FDISK_PART2} | cut -d ' ' -f 3)"
#echo "PART2_START = ${PART2_START}"
#echo "PART2_END = ${PART2_END}"
PART2_NEW_SIZE=$(( ${NEW_SIZE_M} * 1024 * 2 )) # 2.4G in sectors (sector = 512 bytes)
PART2_NEW_END=$(( ${PART2_START} + ${PART2_NEW_SIZE} - 1 ))
NEW_IMG_SIZE=$(( ${PART2_NEW_END} + 1 ))

# Now that the filesystem is smaller, shrink the partition
sudo parted ${DD_DEV} ---pretend-input-tty resizepart 2 ${PART2_NEW_END}s Yes

# Recheck that everything is good after we resized.
sudo e2fsck -f ${DEV_PART2}

# Print it out for sanity
fdisk -l ${DD_DEV}

# Transfer the relevant portion of the filesystem
sudo dd status=progress bs=512 count=${NEW_IMG_SIZE} if=${DD_DEV} of=${IMG_FILENAME}
