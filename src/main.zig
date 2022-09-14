const std = @import("std");
var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
var alloc = arena.allocator();

export fn fill(count: u32) i32 {
    arena.deinit();
    var mem = alloc.alloc(u8, count) catch {
        return -1;
    };
    for (mem) |*adr, i| {
        adr.* = @truncate(u8, i);
    }
    return out_slice(mem);
}

const Slice = packed struct {
    ptr: u32,
    len: u32,
};

fn out_slice(val: anytype) i32 {
    var s = alloc.create(Slice) catch {
        return -1;
    };
    s.ptr = @truncate(u32, @ptrToInt(val.ptr));
    s.len = @truncate(u32, val.len);
    return @as(i32, @truncate(u31, @ptrToInt(s)));
}
