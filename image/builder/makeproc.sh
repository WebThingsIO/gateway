#!/bin/bash

# make /proc/cpuinfo
echo > /rpxc/sysroot/proc/cpuinfo
IFS=$'\n';
count=0
for LINE in `cat /proc/cpuinfo | grep processor`; do
  sh -c 'cat >> /rpxc/sysroot/proc/cpuinfo' <<END
processor       : $count
model name      : ARMv7 Processor rev 4 (v7l)
BogoMIPS        : 38.40
Features        : half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt vfpd32 lpae evtstrm crc32
CPU implementer : 0x41
CPU architecture: 7
CPU variant     : 0x0
CPU part        : 0xd03
CPU revision    : 4

END
  let ++count
done

sh -c 'cat >> /rpxc/sysroot/proc/cpuinfo' <<END
Hardware        : BCM2709
Revision        : a02082
Serial          : 00000000354915813
END

# make /proc/stat
sh -c 'cat > /rpxc/sysroot/proc/stat' <<END
cpu  0 0 0 0 0 0 0 0 0 0
END

count=0
for LINE in `cat /proc/cpuinfo | grep processor`; do
  sh -c 'cat >> /rpxc/sysroot/proc/stat' <<END
cpu$count  0 0 0 0 0 0 0 0 0 0
END
  let ++count
done
