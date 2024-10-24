using Microsoft.EntityFrameworkCore;
using MyMusicApp.Model;

namespace MyMusicApp;

public partial class MusicDbContext : DbContext
{
    public MusicDbContext()
    {
    }

    public MusicDbContext(DbContextOptions<MusicDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Song> Songs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=music_db;Username=postgres;Password=password");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Song>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("songs_pk");

            entity.ToTable("songs");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Artists)
                .HasMaxLength(150)
                .HasColumnName("artists");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SongPath)
                .HasColumnType("character varying")
                .HasColumnName("song_path");
            entity.Property(e=>e.CoverEncoded)
                .HasColumnType("character varying")
                .HasColumnName("cover_encoded");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}